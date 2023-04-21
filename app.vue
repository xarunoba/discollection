<script setup lang="ts">
const projectKey = ref<string | null>('Project Key')
const dataKeys = ref<string[] | null>(['Data Key'])
const { data: _projectKey } = await useFetch(`/api/projectkey`)
const { data: _dataKeys } = await useFetch<string[] | null>(`/api/datakeys`)
const keyInput = ref('')

onMounted(() => {
  projectKey.value = _projectKey.value
  dataKeys.value = _dataKeys.value
})

const saveKey = async () => {
  if (keyInput.value !== '') {
    if (dataKeys.value) dataKeys.value.push(keyInput.value)
    else dataKeys.value = [keyInput.value]
    const { data } = await useFetch('/api/datakeys', {
      method: 'POST',
      body: { data_keys: dataKeys },
    })
  }
}
const deleteKey = async (index: number) => {
  if (dataKeys.value) {
    dataKeys.value.splice(index, 1)
    const { data } = await useFetch('/api/datakeys', {
      method: 'POST',
      body: { data_keys: dataKeys },
    })
  }
}
</script>

<template>
  <div>
    <Head>
      <Title>Discollection</Title>
      <Meta name="title" content="Discollection" />
      <Meta
        name="description"
        content="A cure for an itch: your own disposable collection."
      />
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
    </Head>
    <h1>Why Discollection?</h1>
    <p>
      Discollection's purpose is to become a disposable collection. Since you
      still cannot delete collections, this space application is a temporary
      solution.
    </p>
    <details>
      <summary>Project Key</summary>
      <p>
        <code>{{ projectKey }}</code>
      </p>
      <p>
        Make sure to protect your project key as much as possible. This is a
        permanent access key to your collection.
      </p>
    </details>
    <details>
      <summary>Data Keys</summary>
      <p>
        If you want to create a disposable access key, create a data key. To
        generate a data key, open your Discollection's settings and head to the
        <span class="highlight">Keys</span> tab/section.
      </p>
      <p>
        You can save your data keys here as backup copy since you can only see
        data keys once during their generation.
      </p>
      <input type="text" placeholder="Enter data key" v-model="keyInput" />
      <button @click="saveKey()">Save</button>
      <p>Saved data keys:</p>
      <ul v-if="dataKeys?.length">
        <li v-for="(dataKey, index) in dataKeys" :key="index">
          <code>{{ dataKey }}</code>
          <button @click="deleteKey(index)">Delete</button>
        </li>
      </ul>
      <p v-else>No data keys saved.</p>
    </details>
  </div>
</template>
