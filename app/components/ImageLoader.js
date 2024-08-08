import Image from "next/image";

export function ImageLoader({
  src,
  alt = "",
  width = 500,
  height = 500,
  style,
}) {
  return (
    <>
      <div className="w-full">
        <Image
          src={src}
          alt={alt}
          // width={width}
          // height={height}
          style={style}
        ></Image>
      </div>
    </>
  );
}
