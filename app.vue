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
    await useFetch('/api/datakeys', {
      method: 'POST',
      body: { data_keys: dataKeys },
    })
    keyInput.value = ''
  }
}
const deleteKey = async (index: number) => {
  if (confirm('Are you sure you want to delete this key?')) {
    if (dataKeys.value) {
      dataKeys.value.splice(index, 1)
      await useFetch('/api/datakeys', {
        method: 'POST',
        body: { data_keys: dataKeys },
      })
    }
  }
}
const downloadKeys = () => {
  const link = document.createElement('a')
  const file = new Blob(
    [
      `Project Key:\n${projectKey.value}\n\nData Keys:\n${
        dataKeys.value?.length ? dataKeys.value.join('\n') : 'Empty'
      }`,
    ],
    { type: 'text/plain' }
  )
  link.href = URL.createObjectURL(file)
  link.download = 'discollection-keys.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <Html lang="en">
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
    <Body>
      <h1>Why Discollection?</h1>
      <p>
        Discollection's purpose is to become a disposable collection. Since you
        still cannot delete collections, this space application is a temporary
        solution.
      </p>
      <p>
        When creating a deta base, please do not use the namespace
        <span class="highlight">discollection-config</span>. It is used to store
        data for this space application.
      </p>
      <h2>Resources</h2>
      <ul>
        <li>
          <a href="https://deta.space/" target="_blank">Deta Space</a>
        </li>
        <li>
          <a
            href="https://deta.space/docs/en/introduction/start"
            target="_blank"
            >Deta Developer Docs</a
          >
        </li>
        <li>
          <a href="https://github.com/Xarunoba/discollection" target="_blank"
            >Github</a
          >
        </li>
      </ul>
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
          generate a data key, open your Discollection's settings and head to
          the
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
      <button @click="downloadKeys()">Download Keys</button>
    </Body>
  </Html>
</template>
