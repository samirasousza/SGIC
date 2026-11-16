import { useRef, useState } from "react";
import type { PointerEvent, ChangeEvent } from "react";
import { Icon } from "../Icon";

const MAX_SIGNATURE_BYTES = 300 * 1024;

interface SignatureFieldProps {
  onSignatureChange: (signature: string | null) => void;
}

export function SignatureField({ onSignatureChange }: SignatureFieldProps) {
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [drawing, setDrawing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInkRef = useRef(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
    setDrawing(false);
    setFileName("");
    setError("");
    onSignatureChange(null);
  };

  const changeMode = (nextMode: "draw" | "upload") => {
    clear();
    setMode(nextMode);
  };

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#123b56";

    if (!hasInkRef.current || !drawing) {
      context.beginPath();
      context.moveTo(x, y);
      hasInkRef.current = true;
      setDrawing(true);
      canvas.setPointerCapture(event.pointerId);
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const finishDrawing = () => {
    setDrawing(false);
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (!dataUrl || !hasInkRef.current) return;

    const base64 = dataUrl.split(",")[1] ?? "";
    const size = Math.ceil((base64.length * 3) / 4);
    if (size > MAX_SIGNATURE_BYTES) {
      setError("A assinatura ultrapassou 300 KB. Limpe e tente novamente.");
      onSignatureChange(null);
      return;
    }
    setError("");
    onSignatureChange(dataUrl);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      setError("Envie uma imagem PNG.");
      onSignatureChange(null);
      event.target.value = "";
      return;
    }
    if (file.size > MAX_SIGNATURE_BYTES) {
      setError("A imagem deve ter no máximo 300 KB.");
      onSignatureChange(null);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        setError("Não foi possível ler a imagem selecionada.");
        onSignatureChange(null);
        return;
      }
      setFileName(file.name);
      setError("");
      onSignatureChange(result);
    };
    reader.onerror = () => {
      setError("Não foi possível ler a imagem selecionada.");
      onSignatureChange(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-800">Assinatura da avaliação</h3>
        <p className="mt-1 text-sm text-slate-500">
          Desenhe sua assinatura ou envie uma imagem PNG de até 300 KB.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button type="button" onClick={() => changeMode("draw")} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${mode === "draw" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          Assinar com caneta
        </button>
        <button type="button" onClick={() => changeMode("upload")} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${mode === "upload" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          Anexar imagem
        </button>
      </div>

      {mode === "draw" ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <canvas
              ref={canvasRef}
              width={700}
              height={180}
              onPointerDown={draw}
              onPointerMove={(event) => { if (drawing) draw(event); }}
              onPointerUp={finishDrawing}
              onPointerCancel={finishDrawing}
              className="block h-36 w-full touch-none cursor-crosshair sm:h-44"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={clear} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-red-600">
              <Icon name="trash-2" size={15} /> Limpar assinatura
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Icon name="upload" size={24} />
          </div>
          <strong className="text-sm font-semibold text-slate-700">{fileName || "Selecionar imagem da assinatura"}</strong>
          <span className="text-xs text-slate-500">Somente PNG, até 300 KB</span>
          <input type="file" accept="image/png" className="sr-only" onChange={handleFileChange} />
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
