export const ReportIcon = (props: any) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 4a2 2 0 0 1 2-2h9.167a2 2 0 0 1 1.42.592l2.833 2.856A2 2 0 0 1 20 6.856V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z"
      fill={props.colors.main}
    />
    <path
      d="m17 11-3.182 4.813-3.636-2.188L7 18"
      stroke={props.colors.dark}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path d="M14 2h2l4 4v2h-5a1 1 0 0 1-1-1V2Z" fill={props.colors.dark} />
  </svg>
)
