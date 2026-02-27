import asyncio
from surrealdb import Surreal

async def main():
    token = "eyJhbGciOiJQUzI1NiIsImtpZCI6IjFkNmViYjAyLWM5ZjEtNDg4Zi1iNjhjLWNlMzMzMzU4YzgyOCIsInR5cCI6IkpXVCJ9.eyJhYyI6ImNsb3VkIiwiYXVkIjoiMDZlN3BjYjNjdHA4OTkzN2xpMnY0cjRpYWsiLCJleHAiOjE3NzIwNDM1MzQsImlhdCI6MTc3MjA0MjkzNCwicmwiOlsiT3duZXIiXX0.pbVrdAyR3qeSG_tglBvddpMP35n48kwY2xNz17OkrqpzL_jybTzOokjbzMB_4-aQfnl85bY4wf249-CdlYMeh5H9vOspBZ4p_oTGdgRAEbOlqhYLsB8cxApxeqGF0q1hL02M8b34B6-DgZ6EV8lFkaaV7IbwQJoHwEyaVwm3nJHJ-dIZtQIdTF_lHg55qGDljsrkEfLj0x3ZjuurVRtTxqXTmz4UE73XwFhlTAV1TUdoqYfu8h8ZTdDd0zUGUAADA8ggAX5ROjZzdU-EGBEcPgkaWcu7OROHOOs5ClvQUEnPTu_XmvXbEs_YhMj5nXkaXGU2sxLOAY_aL5mbyQ7Bow"
    async with Surreal("wss://audioprism-06e7pcb3ctp89937li2v4r4iak.aws-use1.surreal.cloud") as db:
        await db.authenticate(token)
        await db.use("audioprism", "open-notebook")
        # Find sources without a user ID
        orphans = await db.query("SELECT * FROM source WHERE user_id IS NONE OR user_id = NULL")
        print("Source Orphans:", len(orphans[0]['result']))
        for o in orphans[0]['result']:
            print(f"Source ID: {o['id']}, Title: {o.get('title')}, Command: {o.get('command')}")
            
        episode_orphans = await db.query("SELECT * FROM episode WHERE user_id IS NONE OR user_id = NULL")
        print("Episode Orphans:", len(episode_orphans[0]['result']))
        for o in episode_orphans[0]['result']:
            print(f"Episode ID: {o['id']}, Name: {o.get('name')}, Command: {o.get('command')}")

if __name__ == "__main__":
    asyncio.run(main())
