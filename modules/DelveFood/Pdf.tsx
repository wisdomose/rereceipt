import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { RECEIPT } from "../../types";

export default function Pdf({ structure }: { structure: Required<RECEIPT> }) {
  Font.register({
    family: "Raleway",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCPNLA3JC9c.ttf",
      },
      {
        fontWeight: "600",
        src: "https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVsEpYCPNLA3JC9c.ttf",
      },
      {
        fontWeight: "900",
        src: "https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVtzpYCPNLA3JC9c.ttf",
      },
    ],
  });

  if (Object.keys(structure).length === 0)
    return (
      <Document>
        <Page>
          <Text>an error occured please contact us</Text>
        </Page>
      </Document>
    );

  const styles = StyleSheet.create({
    page: {
      fontFamily: structure.settings.font_family,
      fontSize: structure.settings.font_size,
      width: structure.settings.width,
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: "3.2px 6px 3.2px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
    },
    bold: {
      fontWeight: "bold",
    },
    divider: {
      overflow: "hidden",
      letterSpacing: "4.8px",
      marginTop: "4.8px",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
      marginTop: "6.4px",
    },
    table_row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    amount: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "8px",
    },
  });

  return (
    <Document>
      <Page
        size={[Number(structure.settings.width.slice(0, -2))]}
        style={styles.page}
      ></Page>
    </Document>
  );
}
