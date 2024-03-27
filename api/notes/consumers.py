import json

from channels.generic.websocket import AsyncWebsocketConsumer


def get_group_name(user_id):
    return f"notes_{user_id}"


class NotesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.user_id = self.user.id

        self.group_name = get_group_name(self.user_id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
        except Exception:
            return

        event_type = text_data_json.get("type")
        data = text_data_json.get("data")

        if not event_type and not data:
            return

        await self.channel_layer.group_send(
            self.group_name, {"type": event_type, "data": data, "sender_channel_name": self.channel_name}
        )

    async def note_update(self, event):
        if self.channel_name != event["sender_channel_name"]:
            await self.send(text_data=json.dumps(event))
