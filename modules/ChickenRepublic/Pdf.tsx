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
      >
        <Text>**** CUSTOMER’S COPY ****</Text>
        <Text>TOPMCAND TEMPERATE JUNIOR</Text>
        <Text>7B SPRING ROAD CALABAR MUNICIPALITY</Text>
        <Text style={styles.bold}> CARD PAYMENT</Text>
        <Text>
          RECEIPT NO: <Text>0000002060</Text>
        </Text>

        <Text style={styles.divider}>
          ..............................................
        </Text>

        {/* start */}
        <View style={styles.table}>
          <View style={styles.table_row}>
            <Text>TERMINAL :</Text>
            <Text>20709CUC</Text>
          </View>
          <View style={styles.table_row}>
            <Text>DATE :</Text>
            <Text>Fri Dec 9 2022</Text>
          </View>
          <View style={styles.table_row}>
            <Text>TIME :</Text>
            <Text>6 : 20 : 13 PM</Text>
          </View>
          <View style={styles.table_row}>
            <Text>CARD :</Text>
            <Text>VERVE</Text>
          </View>
          <View style={styles.table_row}>
            <Text>CARD EXP. :</Text>
            <Text>2303</Text>
          </View>
          <View style={styles.table_row}>
            <Text>CLIENT :</Text>
            <Text>INSTANT /VERVE</Text>
          </View>
          <View style={styles.table_row}>
            <Text>PAN :</Text>
            <Text>506107*********2302</Text>
          </View>
          <View style={styles.table_row}>
            <Text>AID :</Text>
            <Text>A0000003710001</Text>
          </View>
        </View>
        {/* end */}

        <View style={styles.amount}>
          <Text>************************</Text>
          <Text>NGN1,000.00</Text>
          <Text style={{ marginTop: "1.6px" }}>************************</Text>
        </View>

        {/* start */}
        <View style={styles.table}>
          <View style={styles.table_row}>
            <Text>RESPONSE CODE :</Text>
            <Text>00</Text>
          </View>
          <View style={styles.table_row}>
            <Text>MESSAGE :</Text>
            <Text>Transaction Approved</Text>
          </View>
          <View style={styles.table_row}>
            <Text>STAN :</Text>
            <Text>001677</Text>
          </View>
          <View style={styles.table_row}>
            <Text>RRN :</Text>
            <Text>000000001677</Text>
          </View>
        </View>
        {/* end */}

        <Text style={styles.divider}>
          ..............................................
        </Text>

        <Text style={{ marginTop: "4.8px" }}>Thanks, call again!</Text>
      </Page>
    </Document>
  );
}
