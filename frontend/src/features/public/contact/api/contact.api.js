import {httpClient} from "../../../../shared/api/httpClient";

export const ContactAPI = {
    send: async ({fullName, email, phone, message}) => {
        const res = await httpClient.post("/v1/mail/contact", {
            fullName,
            email,
            phone,
            message,
        }, {
            showErrorToast: false,
        });
        return res.data;
    },
};
