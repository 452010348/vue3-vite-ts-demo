<template>
  <div>
    <button @click="modal.open()">Open Connect Modal</button>
    <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useWeb3Modal } from '@web3modal/ethers5/vue'
const modal = useWeb3Modal()
</script>