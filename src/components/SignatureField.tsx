
import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Icon } from "./Icon";

export function SignatureField({
  onSigned,
}: {
  onSigned: (signed: boolean) => void;
}) {
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [drawing, setDrawing] = useState(false);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clear = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }

    setDrawing(false);
    onSigned(false);
  };

  const changeMode = (nextMode: "draw" | "upload") => {
    clear();
    setFileName("");
    setMode(nextMode);
  };

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (!context) return;

    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#123b56";

    if (!drawing) {
      context.beginPath();
      context.moveTo(x, y);
      setDrawing(true);
      onSigned(true);
      canvas.setPointerCapture(event.pointerId);
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      onSigned(false);
      return;
    }

    const validType = ["image/png", "image/jpeg"].includes(file.type);
    const validSize = file.size <= 5 * 1024 * 1024;

    if (!validType || !validSize) {
      setFileName("");
      onSigned(false);
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    onSigned(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Assinatura da avaliação
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Escolha uma das formas de assinatura abaixo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => changeMode("draw")}
          className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            mode === "draw"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Assinar com caneta
        </button>

        <button
          type="button"
          onClick={() => changeMode("upload")}
          className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            mode === "upload"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
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
              onPointerMove={(event) => {
                if (drawing) draw(event);
              }}
              onPointerUp={() => setDrawing(false)}
              onPointerCancel={() => setDrawing(false)}
              className="block h-36 w-full touch-none cursor-crosshair sm:h-44"
            />
          </div>

          <div className="flex justify-end gap-2 sm:flex-row sm:items-center">
            {/* <span className="text-xs text-slate-500">
              Assine dentro da área usando o mouse ou toque.
            </span> */}

            <button
              type="button"
              onClick={clear}
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-red-600"
            >
              <Icon name="trash-2" size={15} />
              Limpar assinatura
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Icon name="upload" size={24} />
          </div>

          <strong className="text-sm font-semibold text-slate-700">
            {fileName || "Selecionar imagem da assinatura"}
          </strong>

          <span className="text-xs text-slate-500">
            PNG ou JPG, até 5 MB
          </span>

          <input
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
