// test_storage.mjs
import { getStorageProvider, LocalStorageProvider } from './src/lib/storage/index.ts';
import fs from 'fs';

async function run() {
  console.log('--- TESTING STORAGE ABSTRACTION ---');
  const provider = getStorageProvider();
  console.log('Active provider:', provider.name);

  const testBuffer = Buffer.from('test-image-content');
  const uploadResult = await provider.upload(testBuffer, 'test_sample.png', 'image/png');
  console.log('Upload Result:', uploadResult);

  if (!uploadResult.url) {
    throw new Error('Upload failed: no URL returned');
  }

  const deleteSuccess = await provider.delete(uploadResult.publicId || uploadResult.url);
  console.log('Delete result:', deleteSuccess);

  console.log('PASS: Storage abstraction tests succeeded!\n');
}

run().catch(console.error);
