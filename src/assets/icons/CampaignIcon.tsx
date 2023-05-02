export const CampaignIcon = (props: any) => (
  <svg
    width={18}
    height={17}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 7a2 2 0 0 1 2-2h7v6H2a2 2 0 0 1-2-2V7Z" fill={props.colors.dark} />
    <path
      d="M8 5.618a1 1 0 0 1 .553-.894l8-4A1 1 0 0 1 18 1.618v12.764a1 1 0 0 1-1.447.894l-8-4A1 1 0 0 1 8 10.382V5.618ZM5 17a2 2 0 0 1-2-2v-4h4v4a2 2 0 0 1-2 2Z"
      fill={props.colors.main}
    />
  </svg>
)
