import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { genPdfStyle } from "../../utils";
import { RECEIPT } from "../../types";

export default function Pdf({ structure }: { structure: Required<RECEIPT> }) {
  Font.register({
    family: "Moulpali",
    fonts: [
      {
        src: "http://fonts.gstatic.com/s/moulpali/v28/H4ckBXKMl9HagUWymyY6wr-wg763.ttf",
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
      lineHeight: "1.4px",
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
      margin: "8px 0",
      height: "1px",
      width: "100%",
      borderRadius: 99999,
      backgroundColor: "rgb(55 65 81)",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
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
        <Text style={genPdfStyle(structure.name)}>{structure.name.label}</Text>
        <Text
          style={{
            ...genPdfStyle(structure.location),
            width: "75%",
            margin: "0 auto",
          }}
        >
          {structure.location.label}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "0 auto",
            // width:"100%",
            alignItems: "center",
          }}
        >
          <Text style={{ marginRight: "4px" }}>TEL:</Text>

          <Text
            key={structure.contacts.label}
            style={{ ...genPdfStyle(structure.contacts), marginRight: "4px" }}
          >
            {structure.contacts.label}
          </Text>
        </View>

        <Text style={genPdfStyle(structure.email)}>
          {structure.email.label}
        </Text>

        <View style={styles.divider}></View>

        {/* metadata */}
        <View style={styles.table}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={{ width: "100%" }}>Receipt of Purchase(Inc Tax)</Text>
            {/* date time */}
            <View
              wrap={false}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Text
                style={{ ...genPdfStyle(structure.date), marginRight: "4px" }}
              >
                {structure.date.label}
              </Text>
              <Text style={genPdfStyle(structure.time_in)}>
                {structure.time_in.label}
              </Text>
            </View>
          </View>
          {/* staff */}
          <View style={styles.table_row}>
            <Text>Staff</Text>
            <Text style={genPdfStyle(structure.cashier_name)}>
              {structure.cashier_name.label}
            </Text>
          </View>
          {/* device */}
          <View style={styles.table_row}>
            <Text>Device</Text>
            <Text style={genPdfStyle(structure.device)}>
              {structure.device.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        {/* products */}
        <View style={styles.table}>
          {structure.products.map((product, index) => (
            <View key={index} style={styles.table_row}>
              {product.map((col, position) => (
                <Text
                  key={col.label}
                  wrap={false}
                  style={{
                    ...genPdfStyle(col),
                    width:
                      position === 0 ? "50%" : 50 / (product.length - 1) + "%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {col.label}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.divider}></View>

        {/* total */}
        <View style={styles.table}>
          <View style={styles.table_row}>
            <Text>Sub Total</Text>
            <Text style={genPdfStyle(structure.sub_total)}>
              {structure.sub_total.label}
            </Text>
          </View>
          <View style={styles.table_row}>
            <Text>Total</Text>
            <Text style={genPdfStyle(structure.total)}>
              {structure.total.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        {/* payment method */}

        <View style={styles.table}>
          <View style={styles.table_row}>
            <Text style={{ textTransform: "uppercase" }}>
              payment by tender
            </Text>
            <Text style={{ textTransform: "uppercase", textAlign: "right" }}>
              amount
            </Text>
          </View>
          <View style={styles.table_row}>
            <Text style={genPdfStyle(structure.payment_type)}>
              {structure.payment_type.label}
            </Text>
            <Text style={genPdfStyle(structure.total)}>
              {structure.total.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        {/* tax */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          {/* vat */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Text style={{ textTransform: "uppercase" }}>tax rate</Text>
            <Text style={genPdfStyle(structure.tax_rate)}>
              {structure.tax_rate.label} vat
            </Text>
          </View>
          {/* percentage */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Text style={{ textTransform: "uppercase", textAlign: "right" }}>
              percentage
            </Text>
            <Text style={genPdfStyle(structure.tax_percentage)}>
              {structure.tax_percentage.label}%
            </Text>
          </View>
          {/* tax */}
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
                textAlign: "right",
              }}
            >
              tax
            </Text>
            <Text style={genPdfStyle(structure.tax_paid)}>
              {structure.tax_paid.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        <Text style={genPdfStyle(structure.footer_message_01)}>
          {structure.footer_message_01.label}
        </Text>
      </Page>
    </Document>
  );
}
