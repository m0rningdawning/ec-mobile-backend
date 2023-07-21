import { Request, Response } from "express";
import * as Imap from "imap";
import { Box } from "imap";

interface EmailCredentials {
  imap: string;
  email: string;
  password: string;
}

const noNewMailMessages = [
  "No new mail. Enjoy your day!",
  "You're all caught up. No new messages.",
  "Inbox empty. Nothing new to read.",
  "No unread emails. Keep up the good work!",
  "Great news! Your inbox is clear.",
  "No new mail. Take a break and relax.",
  "Congratulations! Zero unread emails.",
  "No new messages. Take a moment to breathe.",
  "Inbox up to date. No new emails found.",
  "No unread emails. Keep up the productivity!",
  "All clear! No new messages in your inbox.",
  "No new mail. Time for a well-deserved break!",
  "Nothing new to report. Inbox empty.",
  "No unread emails. Enjoy the peace and quiet.",
  "Zero new messages. Keep up the good habits!",
  "No new mail. Take a moment for yourself.",
  "Inbox empty. No new messages to read.",
  "No new emails. Enjoy the clutter-free inbox!",
  "No unread messages. Time for a celebration!",
  "No new mail. Stay focused and keep it up!",
  "You're up to date. No new messages received.",
  "No new mail. Everything is under control.",
  "Inbox empty. No new messages waiting.",
  "No unread emails. Feel the satisfaction!",
  "All clear! No new messages to attend to.",
  "No new mail. Your inbox is pristine.",
  "Congratulations! No unread emails.",
  "No new messages. Relax and unwind.",
  "Inbox up to date. Nothing new to see here.",
  "No unread emails. Keep up the great work!",
  "All clear! No new messages in sight.",
  "No new mail. Take a moment to recharge.",
  "Nothing new to report. Inbox is clear.",
  "No unread emails. Enjoy the tranquility.",
  "Zero new messages. Keep it up!",
  "No new mail. Indulge in some me-time.",
  "Inbox empty. No new messages available.",
  "No new emails. Revel in the empty inbox!",
  "No unread messages. Celebrate the achievement!",
  "No new mail. Stay focused and determined.",
  "You're up to date. No new messages to handle.",
  "No new mail. Everything is in order.",
  "Inbox empty. No new messages in queue.",
  "No unread emails. Embrace the calmness!",
  "All clear! No new messages to address.",
  "No new mail. Your inbox is spotless.",
  "Congratulations! No unread emails in sight.",
  "No new messages. Take a moment to relax.",
  "Inbox up to date. Nothing new to read.",
  "No unread emails. Keep up the outstanding work!",
  "All clear! No new messages to worry about.",
  "No new mail. Pause and enjoy the moment.",
];

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

    //console.log(credentials);

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
            console.log("No new unread messages.");
            const randomMessage =
              noNewMailMessages[
                Math.floor(Math.random() * noNewMailMessages.length)
              ];
            return res.json({ message: randomMessage });
          }

          imap.end();
          console.log(`You have ${results.length} new unread messages.`);
          return res.json({
            message: `You have ${results.length} new unread messages.`,
          });
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
