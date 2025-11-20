import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { ClearOutlined, CheckOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface SignaturePadProps {
  onSave: (signatureFile: File) => void;
  width?: number;
  height?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, width = 400, height = 150 }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas background to white
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { x, y } = getCoordinates(e);

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { x, y } = getCoordinates(e);

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    // Convert canvas to blob then to File
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `signature_${Date.now()}.png`, {
        type: "image/png",
      });

      onSave(file);
    }, "image/png");
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border border-gray-200 rounded cursor-crosshair w-full"
          style={{ touchAction: "none" }}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{t("aiDiagnosis.signaturePad.instruction")}</p>
        <div className="flex gap-2">
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            {t("aiDiagnosis.signaturePad.clear")}
          </Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} disabled={isEmpty}>
            {t("aiDiagnosis.signaturePad.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
