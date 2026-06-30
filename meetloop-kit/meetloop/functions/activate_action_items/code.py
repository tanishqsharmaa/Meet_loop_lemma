#input_type_name: ActivateInput
#output_type_name: ActivateResult
#function_name: activate_action_items

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class ActivateInput(BaseModel):
    meeting_id: str


class ActivateResult(BaseModel):
    items_activated: int


async def activate_action_items(ctx: FunctionContext, data: ActivateInput) -> ActivateResult:
    """
    Bulk update action items from pending_review to active for a given meeting.
    """
    pod = Pod.from_env()
    
    records_page = pod.table('action_items').list(
        filter=[{"field": "meeting_id", "op": "eq", "value": data.meeting_id}]
    )
    items = records_page.to_dict()["items"]
    
    activated_count = 0

    for item in items:
        if item.get('status') == 'pending_review':
            pod.table('action_items').update(item['id'], {
                'status': 'active'
            })
            activated_count += 1

    return ActivateResult(items_activated=activated_count)
