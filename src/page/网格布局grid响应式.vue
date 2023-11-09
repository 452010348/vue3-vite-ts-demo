<style scoped>
.layout{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap:20px;
}
.layout > section{
    height: 200px;
    background: #ffcf7f;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<template>
    <div class="layout">
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
    </div>
</template>

