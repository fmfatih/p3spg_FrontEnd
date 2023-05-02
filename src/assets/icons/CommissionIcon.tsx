import { SVGProps } from "react"

interface IconProps {
  colors: {
    main: string;
    dark: string;
  }
}

export const CommissionIcon = (props: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.339 20.803 5.283 19.31a1.952 1.952 0 0 1-1.29-1.877c.036-1.334.127-2.887.324-3.3.343-.722 2.534-.574 3.2-.463.532.089 1.436.481 1.822.666h4.285c.792 0 1.548.459 1.72 1.232.035.153.057.302.06.43.004.125-.012.25-.012.374v.043l4.3-1.905a1.993 1.993 0 0 1 2.479.915l.14.263a.746.746 0 0 1-.4 1.053l-11.096 4.063c-.477.175-1 .175-1.476 0Z"
      fill={props.colors.main}
      stroke={props.colors.main}
    />
    <rect x={1} y={12.509} width={3.61} height={8.387} rx={1} fill={props.colors.dark} />
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill={props.colors.main} />
    <path
      d="M10 7h4"
      stroke={props.colors.dark}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={12} cy={5.177} r={0.577} fill={props.colors.dark} />
    <circle cx={12} cy={8.823} r={0.577} fill={props.colors.dark} />
  </svg>
)
