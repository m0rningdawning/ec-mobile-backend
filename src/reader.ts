import { Request, Response } from "express";
import * as Imap from "imap";
import { Box } from "imap";

interface EmailCredentials {
  imap: string;
  email: string;
  password: string;
}

export function readEmails(
  req: Request,
  res: Response,
  credentials: EmailCredentials
) {
  try {
    const imap = new Imap({
      user: credentials.email,
      password: credentials.password,
      host: credentials.imap,
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    });

    console.log(credentials);

    imap.once("ready", function () {
      function openInbox(cb: (error: Error | null, mailbox?: Box) => void) {
        imap.openBox("INBOX", true, cb);
      }
    
      openInbox(function (err: Error | null, box?: Box) {
        if (err) throw err;
    
        imap.search(["UNSEEN"], function (err: Error, results: number[]) {
          if (err) throw err;
    
          if (results.length === 0) {
            imap.end();
            return res.send("You have no new unread messages.");
          }
    
          imap.end();
          return res.send(
            `You have ${results.length} new unread ${
              results.length === 1 ? "message" : "messages"
            }.`
          );
        });
      });
    });

    imap.once("error", function (err: Error) {
      console.error("Error processing emails:", err);
      return res
        .status(500)
        .json({ error: "Error connecting to email server." });
    });

    imap.once("end", function () {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (error) {
    console.error("Error processing emails:", error);
    return res.status(500).json({ error: "Error processing emails." });
  }
}
