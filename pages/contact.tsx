import Button from "../components/button";
import Input from "../components/input";
import Page from "../components/layout/Page";
import TextArea from "../components/textarea";
import useInput from "../hooks/useInput";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { notify } from "../utils";
import useFetcher from "../hooks/useFetcher";

export default function Contact() {
  const [email, emailOptions] = useInput("");
  const [subject, subjectOptions] = useInput("");
  const [name, nameOptions] = useInput("");
  const [message, setMessage] = useState("");
  const { loading, wrapper } = useFetcher();

  const mail = useCallback(async () => {
    await axios({
      method: "POST",
      url: "/api/mail",
      data: {
        name,
        from: email,
        message,
        subject,
      },
    })
      .then((res) => {
        notify(res.data.message);
      })
      .catch((e) => {
        notify("Failed to send message");
      });
  }, [name, email, message, subject]);

  return (
    <Page>
      <Page.Body>
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="text-4xl font-semibold text-gray2 leading-[50px] my-[70px]"
            initial={{ x: "50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0, type: "spring" }}
          >
            Hey there,
            <br /> we&apos;d love to hear from you
          </motion.h1>
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              wrapper(mail);
            }}
            className="flex gap-[50px] flex-col"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Input
              type="text"
              id="name"
              label="name"
              labelClassName="font-semibold"
              {...nameOptions}
              required
            />

            <Input
              type="email"
              id="email"
              label="email"
              labelClassName="font-semibold"
              {...emailOptions}
              required
            />
            <Input
              type="text"
              id="subject"
              label="subject"
              labelClassName="font-semibold"
              {...subjectOptions}
            />

            <TextArea
              name="message"
              id="message"
              label="message"
              value={message}
              labelClassName="font-semibold"
              required
              onChange={(e) => setMessage(e.target.value)}
            />

            <motion.div
              className="text-sm text-end"
              initial={{ y: "50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              <Button label="Send" type="submit" loading={loading} />
            </motion.div>
          </motion.form>
        </div>
      </Page.Body>
    </Page>
  );
}
