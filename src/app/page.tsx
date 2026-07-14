"use client";

import Link from "next/link";
import { useState, useRef, Fragment, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceValue } from "usehooks-ts";
import { ColorPicker } from "@/components/colorPicker";
import {
  QrCodeStyler,
  downloadStyledQr,
  stylePresets,
  type StylePreset,
} from "@/components/qrCodeStyler";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Eye, EyeOff } from "lucide-react";

const RandomPoints = dynamic(
  () => import("@/components/randomPoints").then((mod) => mod.RandomPoints),
  { ssr: false }
);

type QrType = "url" | "text" | "wifi";
type EncryptionType = "WPA" | "WEP" | "NONE";

function escapeWifiField(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/:/g, "\\:");
}

function buildWifiPayload(
  ssid: string,
  password: string,
  encryption: EncryptionType,
  hidden: boolean
): string {
  let payload = "WIFI:";
  if (encryption !== "NONE") {
    payload += `T:${encryption};`;
  }
  payload += `S:${escapeWifiField(ssid)};`;
  if (encryption !== "NONE") {
    payload += `P:${escapeWifiField(password)};`;
  }
  if (hidden) {
    payload += "H:true;";
  }
  payload += ";";
  return payload;
}

export default function Home() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [qrData, setQrData] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WiFi form state
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<EncryptionType>("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeStyle, setActiveStyle] = useState<StylePreset>(stylePresets[0]);

  const qrPayload = useMemo(() => {
    if (qrType === "url" || qrType === "text") {
      return qrData;
    }
    if (!wifiSsid) return "";
    return buildWifiPayload(wifiSsid, wifiPassword, wifiEncryption, wifiHidden);
  }, [qrType, qrData, wifiSsid, wifiPassword, wifiEncryption, wifiHidden]);

  const [debouncedQrData] = useDebounceValue(qrPayload, 500);
  const [debouncedQrColor] = useDebounceValue(qrColor, 500);
  const [debouncedBgColor] = useDebounceValue(bgColor, 500);

  const presetColors = [
    "#FFB3B3",
    "#B3FFB3",
    "#B3B3FF",
    "#FFB3FF",
    "#000000",
    "#FFFFFF",
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadQR = (type: "svg" | "png") => {
    if (!qrRef.current || !debouncedQrData) return;
    downloadStyledQr(qrRef.current, type);
  };

  return (
    <Fragment>
      <RandomPoints />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 p-10 font-[family-name:var(--font-geist-sans)] relative"
      >
        <motion.header
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 items-center"
        >
          <div className="flex gap-x-2 flex-wrap">
            <p className="text-xs font-mono">
              Crafted by
              <Link
                target="_blank"
                href="https://github.com/minikas"
                className="ml-2 font-bold text-pink-500"
              >
                Kas Ferreira
              </Link>
              <span className="mx-1">&middot;</span>
              Tweaked by
              <Link
                target="_blank"
                href="https://github.com/creasydude"
                className="ml-2 font-bold text-pink-500"
              >
                creasydude
              </Link>
            </p>
          </div>
        </motion.header>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-8 bg-white/5 rounded-md p-5 min-w-[300px]"
        >
          <div className="flex flex-col gap-4">
            {/* QR Type Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <ToggleGroup
                type="single"
                value={qrType}
                onValueChange={(value) => value && setQrType(value as QrType)}
                className="justify-center"
              >
                <ToggleGroupItem value="url" aria-label="URL">
                  URL
                </ToggleGroupItem>
                <ToggleGroupItem value="text" aria-label="Text">
                  Text
                </ToggleGroupItem>
                <ToggleGroupItem value="wifi" aria-label="WiFi">
                  WiFi
                </ToggleGroupItem>
              </ToggleGroup>
            </motion.div>

            <motion.div
              ref={qrRef}
              style={{ backgroundColor: debouncedBgColor }}
              className="flex justify-center p-4 rounded-lg relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {debouncedQrData ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <QrCodeStyler
                      value={debouncedQrData}
                      size={250}
                      fgColor={debouncedQrColor}
                      bgColor={debouncedBgColor}
                      errorCorrection={errorLevel}
                      stylePreset={activeStyle}
                      logo={logo}
                    />
                    <Button
                      variant="secondary"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {logo ? "Change Logo" : "Add Logo"}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-[250px] h-[250px] bg-gray-200/90 rounded-lg flex items-center justify-center"
                  >
                    <Button
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add Logo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {qrType === "wifi" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-semibold text-xs opacity-50">
                      SSID
                    </Label>
                    <Input
                      placeholder="Network name"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="border-none md:text-lg p-0 text-center bg-transparent shadow-none outline-none focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-semibold text-xs opacity-50">
                      Password
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="border-none md:text-lg p-0 text-center bg-transparent shadow-none outline-none focus:outline-none w-full pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-semibold text-xs opacity-50">
                      Encryption
                    </Label>
                    <Select
                      value={wifiEncryption}
                      onValueChange={(value) =>
                        setWifiEncryption(value as EncryptionType)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="NONE">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-xs opacity-50">
                      Hidden network
                    </Label>
                    <Switch
                      checked={wifiHidden}
                      onCheckedChange={setWifiHidden}
                    />
                  </div>
                </div>
              ) : (
                <Input
                  placeholder={
                    qrType === "url"
                      ? "Enter your URL"
                      : "Enter your text"
                  }
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="border-none md:text-lg p-0 text-center bg-transparent shadow-none outline-none focus:outline-none w-full"
                />
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {debouncedQrData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ColorPicker
                    label="Color"
                    value={qrColor}
                    onChange={setQrColor}
                    presetColors={presetColors}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ColorPicker
                    label="Background"
                    value={bgColor}
                    onChange={setBgColor}
                    presetColors={presetColors}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2"
                >
                  <h3 className="font-semibold text-xs opacity-50">Style</h3>
                  <div className="flex gap-2 flex-wrap">
                    {stylePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setActiveStyle(preset)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeStyle.name === preset.name
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <h3 className="font-semibold text-xs opacity-50 inline-block">
                            Error Correction
                          </h3>
                          <HelpCircle
                            className="h-3 w-3 inline-block ml-1"
                            color="gray"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            Learn more about{" "}
                            <Link
                              href="https://www.qrcode.com/en/about/error_correction.html"
                              target="_blank"
                              className="text-sm text-blue-500 underline"
                            >
                              error correction levels
                            </Link>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={errorLevel}
                    onValueChange={(value) =>
                      value && setErrorLevel(value as "L" | "M" | "Q" | "H")
                    }
                    className="justify-start"
                  >
                    <ToggleGroupItem value="L" aria-label="Low">
                      L
                    </ToggleGroupItem>
                    <ToggleGroupItem value="M" aria-label="Medium">
                      M
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Q" aria-label="Quartile">
                      Q
                    </ToggleGroupItem>
                    <ToggleGroupItem value="H" aria-label="High">
                      H
                    </ToggleGroupItem>
                  </ToggleGroup>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4 items-center justify-center"
                >
                  <motion.div className="flex-1">
                    <Button
                      onClick={() => downloadQR("svg")}
                      className="w-full"
                    >
                      Export as SVG
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1">
                    <Button
                      variant="secondary"
                      onClick={() => downloadQR("png")}
                      className="w-full"
                    >
                      Export as PNG
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </motion.div>
    </Fragment>
  );
}
