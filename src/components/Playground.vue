<script setup lang="ts">
async function addTableCompoents(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target) {
    await fetch('/__code', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...target.dataset,
        code: `\n      <CustomTable />`,
      }),
    });
  }
}
</script>

<template>
  <h1>点击按钮,在对应按钮的下方动态添加表格</h1>
  <div class="container">
    <div class="box">
      <button @click="addTableCompoents">
        点击添加表格
      </button>
    </div>
    <div class="box">
      <button @click="addTableCompoents">
        点击添加表格
      </button>
    </div>
    <div class="box">
      <button @click="addTableCompoents">
        点击添加表格
      </button>
    </div>
    <div class="box">
      <button @click="addTableCompoents">
        点击添加表格
      </button>
    </div>
  </div>
</template>

<style>
.container {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.box {
  border: 1px solid black;
}
</style>
