import QRCode from "qrcode";
import { BASE_W, BASE_H, buildCouponCode } from "./coupons";
import type { CouponSettings } from "@/store/couponStore";

let cachedBaseImage: HTMLImageElement | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getBaseImage(): Promise<HTMLImageElement> {
  if (cachedBaseImage) return cachedBaseImage;
  cachedBaseImage = await loadImage("/coupon-base.png");
  return cachedBaseImage;
}

export async function renderCouponToBlob(
  index: number,
  settings: CouponSettings,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  const ctx = canvas.getContext("2d")!;

  // 1. Draw base image
  const baseImg = await getBaseImage();
  ctx.drawImage(baseImg, 0, 0, BASE_W, BASE_H);

  // 2. Draw coupon code text
  const code = buildCouponCode(settings.prefix, index);
  ctx.fillStyle = settings.fontColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (settings.textWidth > 0) {
    // Measure natural width first, then scale to fit
    ctx.font = `${settings.fontSize}px "Jalnan Gothic", "Pretendard", system-ui, sans-serif`;
    ctx.letterSpacing = `${settings.letterSpacing}px`;
    const measured = ctx.measureText(code).width;
    const scale = settings.textWidth / measured;

    ctx.save();
    ctx.translate(settings.textX, settings.textY);
    ctx.scale(scale, 1);
    ctx.fillText(code, 0, 0);
    ctx.restore();
  } else {
    ctx.font = `${settings.fontSize}px "Jalnan Gothic", "Pretendard", system-ui, sans-serif`;
    ctx.letterSpacing = `${settings.letterSpacing}px`;
    ctx.fillText(code, settings.textX, settings.textY);
  }

  // 3. Draw QR code
  const qrDataUrl = await QRCode.toDataURL(settings.qrUrl, {
    width: settings.qrSize,
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const qrImg = await loadImage(qrDataUrl);
  // White background behind QR
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(settings.qrX, settings.qrY, settings.qrSize, settings.qrSize);
  const padding = 6;
  ctx.drawImage(
    qrImg,
    settings.qrX + padding,
    settings.qrY + padding,
    settings.qrSize - padding * 2,
    settings.qrSize - padding * 2,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}
