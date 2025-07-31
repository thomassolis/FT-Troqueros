import { Tooltip } from 'react-tooltip';
import { Icon } from "@iconify/react/dist/iconify.js";

function InfoTooltip({ content }: { content: string }) {
  const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <>
      <span 
        data-tooltip-id={tooltipId}
        className="cursor-pointer text-gray-500 hover:text-gray-700 ml-1"
      >
        <Icon icon="mdi:help-circle-outline" width="16" height="16" />
      </span>
      
      <Tooltip 
        id={tooltipId}
        place="top"
        content={content}
        className="max-w-xs z-50"
      />
    </>
  );
}
export default InfoTooltip;