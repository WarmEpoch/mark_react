export const BlobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            resolve(e.target?.result as string)
        }
        fileReader.readAsDataURL(blob)
    })
}

export const Base64ToBlob = (base64: string) => {
    // Split into two parts
    const parts = base64.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: imageType });
}


export const Base64ToFile = (base64Data: string, filename: string) => {
    // 分割base64字符串，获取MIME类型和数据部分
    const parts = base64Data.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    const base64 = parts[1];
    
    // 解码Base64数据
    const byteString = atob(base64);
    
    // 创建Uint8Array来存储二进制数据
    const uint8Array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    
    // 创建File对象并返回
    return new File([uint8Array], filename, { type: mimeType });
}

export const ArrayBufferToBase64 = (buffer: ArrayBuffer | Uint8Array<ArrayBufferLike>) => {
    const binary = new Uint8Array(buffer);
    return btoa(binary.reduce((data, byte) => data + String.fromCharCode(byte), ''));
};

export const Base64ToArrayBuffer = (base64: string) => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

const format = (num: number) => num.toString().padStart(2, "0");
export const formaTime = (dateTime: Date) => {
  const Y = dateTime.getFullYear();
  const M = format(dateTime.getMonth() + 1);
  const D = format(dateTime.getDate());
  const H = format(dateTime.getHours());
  const Mi = format(dateTime.getMinutes());
  const S = format(dateTime.getSeconds());
  return `${Y}.${M}.${D} ${H}:${Mi}:${S}`;
};