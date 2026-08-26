"use client";

import { BrowserQRCodeReader } from "@zxing/browser";
import { Camera, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<{ rawValue: string }[]>;
};
type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

export function QrScanner() {
  const t = useTranslations("scanner");
  const common = useTranslations("common");
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [notice, setNotice] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const navigate = (value: string) => {
    const match =
      value.match(/F\d{4,}/i)?.[0] ?? value.split("/").pop() ?? value;
    router.push(`/products/${match.toUpperCase()}`);
  };
  const stop = () => {
    controlsRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setActive(false);
  };
  async function start() {
    try {
      setNotice("");
      setActive(true);
      const Detector = (
        globalThis as unknown as {
          BarcodeDetector?: BarcodeDetectorConstructor;
        }
      ).BarcodeDetector;
      if (Detector) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          const detector = new Detector({ formats: ["qr_code"] });
          const scan = async () => {
            if (!videoRef.current) return;
            const codes = await detector.detect(videoRef.current);
            if (codes[0]?.rawValue) {
              stop();
              navigate(codes[0].rawValue);
              return;
            }
            if (active) requestAnimationFrame(() => void scan());
          };
          void scan();
        }
      } else {
        const reader = new BrowserQRCodeReader();
        controlsRef.current = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current!,
          (result) => {
            if (result) {
              stop();
              navigate(result.getText());
            }
          }
        );
      }
    } catch {
      stop();
      setNotice(t("permission"));
    }
  }
  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="rounded-lg bg-navy-900 p-3">
          <video
            className="aspect-video w-full rounded bg-slate-900 object-cover"
            muted
            playsInline
            ref={videoRef}
          />
        </div>
        {notice && <p className="text-sm text-red-600">{notice}</p>}
        <div className="flex gap-3">
          {active ? (
            <Button onClick={stop} variant="outline">
              {t("stop")}
            </Button>
          ) : (
            <Button onClick={() => void start()}>
              <Camera className="h-4 w-4" aria-hidden />
              {t("start")}
            </Button>
          )}
        </div>
        <div className="border-t pt-5">
          <label
            className="text-sm font-semibold"
            htmlFor="scanner-part-number"
          >
            {t("manual")}
          </label>
          <div className="mt-2 flex gap-2">
            <Input
              id="scanner-part-number"
              onChange={(event) => setPartNumber(event.target.value)}
              value={partNumber}
            />
            <Button
              aria-label={common("goToProduct")}
              onClick={() => navigate(partNumber)}
              size="icon"
            >
              <Search className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
