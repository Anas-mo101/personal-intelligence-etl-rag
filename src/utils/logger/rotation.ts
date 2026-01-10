import path from "path";

export const getRotationStream = async () => {
  // Dynamic import works in CommonJS
  const { createStream } = await import("rotating-file-stream");
  
  return createStream('app.log', {
    size: '10M',
    compress: 'gzip',
    path: path.join(__dirname, '../../../logs'),
  });
};