import { AnimatedCounter } from "../../../ui/AnimatedCounter/AnimatedCounter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Fragment } from "react/jsx-runtime";

export const ReportsKPI = ({ type, reports, styleReport }: any) => {  

const toNumber = (v: any) => {
  const n = typeof v === "number" ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const calcPercent = (num: number, den: number, decimals = 0) => {
  if (!den) return 0;
  const pct = (num / den) * 100;
  const factor = Math.pow(10, decimals);
  return Math.round(pct * factor) / factor;
};


return (
  <div
    className={`w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-3  ${
      type === "general" ? "lg:grid-cols-4" : "lg:grid-cols-2"
    }`}
  >
    {styleReport?.map((opt:any, index:number) => {
      const prevSection = styleReport[index - 1]?.section;
      const showSectionTitle = opt.section && opt.section !== prevSection;
      const mainValue = toNumber(reports?.[opt.id]);

      // SUB - Versión mejorada con porcentaje más profesional
      let subText = "";
      let subClass = "text-gray-600";
      // @ts-ignore
      let subPrefix = "";      

      if (opt.subType === "percent_of") {
        const num = toNumber(reports?.[opt.subNumeratorId ?? opt.id]);
        const den = toNumber(reports?.[opt.subDenominatorId ?? "totalRows"]);
        const pct = calcPercent(num, den, opt.decimals ?? 1);

          const better = opt.subGood ?? "higher_is_better";
          subClass =
            better === "higher_is_better"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium";

          subPrefix = "·";

        subText = `${pct}%`;
        const goodRule = opt.subGood ?? "higher_is_better";

        if (goodRule === "higher_is_better") {
          subClass = "text-green-600 font-medium";
        } else {
          subClass = "text-red-600 font-medium";
        }
        subPrefix = "·";
      }

      if (opt.subType === "ratio") {
        const num = toNumber(reports?.[opt.subNumeratorId ?? opt.id]);
        const den = toNumber(reports?.[opt.subDenominatorId ?? "totalRows"]);
        subText = `${num}/${den}`;
        subClass = "text-gray-600";
        subPrefix = "·";
      }

      if (opt.subType === "delta_percent") {
        const actual = toNumber(reports?.[opt.subNumeratorId ?? opt.id]);
        const prev = toNumber(reports?.[opt.subDenominatorId ?? "prevValue"]);
        const pct = prev ? calcPercent(actual - prev, prev, opt.decimals ?? 1) : 0;
        const absPct = Math.abs(pct);
        subText = `${pct >= 0 ? "+" : ""}${absPct.toFixed(1)}%`;
        subClass = pct >= 0 
          ? "text-green-600 font-medium" 
          : "text-red-600 font-medium";
        subPrefix = pct >= 0 ? "↗" : "↘";
        // showTrend = true;
      }

      return (
        <Fragment key={opt.id}>
          {showSectionTitle && (
            <div className="col-span-full ">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide ">
                {opt.section}
              </div>
            </div>
          )}

          <div
            className={`p-5 rounded-xl border transition-all duration-300 flex justify-between items-center hover:shadow-lg  ${
              opt.bgColor || "bg-white"
            } ${opt.borderColor || "border-gray-200"}`}
          >
            <div>
              {/* Header con icono */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex">
                  <div className="flex items-center gap-3">
                    {type === 'general'? (
                      <div
                        className={`p-2.5 rounded-lg  ${
                          opt.iconContainerColor || "bg-blue-500"
                        } shadow-sm`}
                      >
                        <Icon
                          icon={opt.icon}
                          width="20"
                          height="20"
                          className="text-white"
                        />
                      </div>
                    ):(null)

                    }
                    <div className="text-gray-600 text-sm font-medium">
                      {opt.title}
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Valor principal */}
              <div className="">
                <div className="flex items-baseline gap-1.5">
                  {opt.prefix && (
                    <span className="text-lg text-gray-500 font-medium">
                      {opt.prefix}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">
                    <AnimatedCounter value={mainValue} />
                  </span>
                  {opt.suffix && (
                    <span className="text-lg text-gray-500 font-medium">
                      {opt.suffix}
                    </span>
                  )}
                </div>
              </div>

              {/* Porcentaje/ratio con estilo profesional */}
              {subText && (
                <div className="border-t border-gray-100">
                  <div className={`flex items-center gap-1.5 text-sm ${subClass}`}>                                 
                    <span className="font-semibold">{subText}</span>                    
                  </div>
                </div>
              )}
            </div>
            {type === 'team'? (
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                opt.iconContainerColor || "bg-blue-500"
              } shadow-sm`}
            >
              <Icon
                icon={opt.icon}
                width="20"
                height="20"
                className="text-white"
              />
            </div>
            ):(null)}

          </div>
        </Fragment>
      );
    })}
  </div>
);
};