import Link from "@material-ui/core/Link";
import LinkNext from "next/link";

export default function LinkUtil(props) {
  const { href, variant, children } = props;
  return (
    <LinkNext href={href}>
      <Link href={href} variant={variant}>
        {children}
      </Link>
    </LinkNext>
  );
}
