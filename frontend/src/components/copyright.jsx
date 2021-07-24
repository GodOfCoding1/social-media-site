import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={`http://${window.location.host}`}>
        {window.location.host}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
