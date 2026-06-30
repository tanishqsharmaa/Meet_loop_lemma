#input_type_name: CCSInput
#output_type_name: CCSResult
#function_name: commitment_confidence_score

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class CCSInput(BaseModel):
    meeting_id: str


class CCSResult(BaseModel):
    needs_approval: bool


async def commitment_confidence_score(ctx: FunctionContext, data: CCSInput) -> CCSResult:
    """
    Fetch all action items for a meeting, score them 0-100 based on commitment strength,
    and update the commitment_confidence_score field in the datastore.
    Returns needs_approval = True if any item scores < 50.
    """
    pod = Pod.from_env()
    
    records_page = pod.table('action_items').list(
        filter=[{"field": "meeting_id", "op": "eq", "value": data.meeting_id}]
    )
    items = records_page.to_dict()["items"]
    
    needs_approval = False

    for item in items:
        score = 50  # baseline

        desc = (item.get('description') or '').lower()
        owner = item.get('owner') or ''
        deadline = item.get('deadline')

        # Language certainty signals
        high_certainty = ['will', 'must', 'need to', 'committed', 'agreed', 'by end of']
        low_certainty = ['maybe', 'perhaps', 'should', 'consider', 'possibly', 'tbd']

        for phrase in high_certainty:
            if phrase in desc:
                score += 10
                break

        for phrase in low_certainty:
            if phrase in desc:
                score -= 15
                break

        # Owner clarity
        if not owner or owner.strip().upper() == 'TBD':
            score -= 20
        elif '/' in owner:  # ambiguous owner e.g. "arjun/priya"
            score -= 10

        # Deadline presence
        if deadline:
            score += 15
        else:
            score -= 5

        final_score = max(0, min(100, score))
        if final_score < 50:
            needs_approval = True
            
        # Update record in datastore
        pod.table('action_items').update(item['id'], {
            'commitment_confidence_score': final_score
        })

    return CCSResult(needs_approval=needs_approval)
