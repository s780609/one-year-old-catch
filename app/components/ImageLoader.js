import Image from "next/image";

export function ImageLoader({
  src,
  alt = "",
  style,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw",
}) {
  return (
    <div className="w-full relative">
      <Image
        src={src}
        alt={alt}
        style={style}
        placeholder="blur"
        quality={75}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
