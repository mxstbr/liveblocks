<script lang="ts" setup>
import { client, type TypedRoom } from "@/liveblocks.config";
import { onUnmounted } from "vue";
import LiveCursors from "@/components/LiveCursors.vue";

const initialPresence = {
  cursor: null,
};

let roomId = "vuejs-live-cursors";
overrideRoomId();

// Join a room
const room: TypedRoom = client.enter(roomId, { initialPresence });

// Leave room onUnmount
onUnmounted(() => {
  client.leave(roomId);
});

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function overrideRoomId() {
  const query = new URLSearchParams(window?.location?.search);
  const roomIdSuffix = query.get("roomId");

  if (roomIdSuffix) {
    roomId = `${roomId}-${roomIdSuffix}`;
  }
}
</script>

<template>
  <LiveCursors :room="room" />
</template>

