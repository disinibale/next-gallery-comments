export default function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        image.src = event.target.result as string;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          let width = image.width;
          let height = image.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(image, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const resizedFile = new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(resizedFile);
                }
              },
              "image/jpeg",
              0.9
            );
          } else {
            reject(new Error("Canvas context is null."));
          }
        };
      } else {
        reject(new Error("Failed to load image from FileReader."));
      }
    };

    reader.readAsDataURL(file);
  });
}
