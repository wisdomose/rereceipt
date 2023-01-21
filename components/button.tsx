type Props = {
  label: string;
  onClick: () => void;
};

export default function Button(props: Props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
