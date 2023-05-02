import * as React from "react"
import { SVGProps } from "react"

interface IconProps {
  colors: {
    main: string;
    dark: string;
  }
}

export const CreditCardIcon = (props: IconProps & SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={2} y={4} width={20} height={16} rx={2} fill={props.colors.main} />
    <path fill={props.colors.dark} d="M2 8h20v2H2z" />
    <rect x={5} y={15} width={6} height={2} rx={1} fill={props.colors.dark} />
  </svg>
)
