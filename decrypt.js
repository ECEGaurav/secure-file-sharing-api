const crypto = require('crypto');
const fs = require('fs');

function decryptFile(inputPath, outputPath, keyHex, ivHex) {
    const algorithm = 'aes-256-ctr';

    // Convert hex strings to Buffers
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(decipher).pipe(output);

    output.on('finish', () => {
        console.log(`✅ File decrypted and saved to: ${outputPath}`);
    });

    output.on('error', (err) => {
        console.error('❌ Decryption failed:', err);
    });
}

// CLI usage
if (require.main === module) {
    const [,, encryptedFile, outputFile, keyHex, ivHex] = process.argv;

    if (!encryptedFile || !outputFile || !keyHex || !ivHex) {
        console.error('Usage: node decrypt.js <encryptedFile> <outputFile> <keyHex> <ivHex>');
        process.exit(1);
    }

    decryptFile(encryptedFile, outputFile, keyHex, ivHex);
}
 