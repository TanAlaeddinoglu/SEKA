import {useMutation} from "@tanstack/react-query";
import {ContactAPI} from "../api/contact.api";

export function useSendContactMail() {
    return useMutation({
        mutationFn: ContactAPI.send,
    });
}
