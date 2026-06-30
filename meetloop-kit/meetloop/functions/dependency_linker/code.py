#input_type_name: DependencyLinkerInput
#output_type_name: DependencyLinkerResult
#function_name: dependency_linker

from pydantic import BaseModel
from typing import Optional
from lemma_sdk import FunctionContext, Pod
from datetime import datetime


BLOCKER_KEYWORDS = ['after', 'once', 'when', 'depends on', 'blocked by', 'following', 'pending']

class DependencyLinkerInput(BaseModel):
    meeting_id: str


class DependencyLinkerResult(BaseModel):
    blockers_found: int


def _parse_deadline(d: Optional[str]) -> Optional[datetime]:
    """Parse ISO date string to datetime, return None on failure."""
    if not d:
        return None
    try:
        if len(d) <= 10:
            return datetime.strptime(d, "%Y-%m-%d")
        return datetime.fromisoformat(d.replace("Z", "+00:00"))
    except ValueError:
        return None


async def dependency_linker(ctx: FunctionContext, data: DependencyLinkerInput) -> DependencyLinkerResult:
    """
    Detect dependencies between action items for a given meeting.
    Writes confirmed blocker pairs to the blockers table.
    """
    pod = Pod.from_env()
    
    records_page = pod.table('action_items').list(
        filter=[{"field": "meeting_id", "op": "eq", "value": data.meeting_id}]
    )
    items = records_page.to_dict()["items"]

    if not items or len(items) < 2:
        return DependencyLinkerResult(blockers_found=0)

    written = 0
    seen_pairs: set[tuple[str, str]] = set()

    for item in items:
        desc = (item.get('description') or '').lower()
        item_deadline = _parse_deadline(item.get('deadline'))

        # Check if this item has any blocker keyword in its description
        has_keyword = any(kw in desc for kw in BLOCKER_KEYWORDS)
        if not has_keyword:
            continue

        item_owner = (item.get('owner') or '').strip().lower()

        for other in items:
            if other['id'] == item['id']:
                continue

            other_deadline = _parse_deadline(other.get('deadline'))
            other_owner = (other.get('owner') or '').strip().lower()

            # Deadline guard: upstream must have an earlier (or equal) deadline
            # If either deadline is missing, skip — can't confirm ordering
            if not other_deadline or not item_deadline:
                continue
            if other_deadline >= item_deadline:
                continue

            pair = (other['id'], item['id'])
            if pair in seen_pairs:
                continue

            # Match condition:
            # A) Same owner — classic self-dependency chain
            same_owner = item_owner and other_owner and item_owner == other_owner
            # B) Cross-owner — upstream owner's name appears in the description
            cross_owner = other_owner and other_owner in desc

            if not (same_owner or cross_owner):
                continue

            # Write blocker row
            pod.table('blockers').create({
                'blocking_item_id': other['id'],
                'blocked_item_id': item['id'],
                'detected_at': datetime.now().isoformat()
            })
            seen_pairs.add(pair)
            written += 1

    return DependencyLinkerResult(blockers_found=written)
