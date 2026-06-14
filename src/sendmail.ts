import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_20kscth';
const TEMPLATE_ID = 'template_a3tohvk';
const PUBLIC_ID = '_p4eliT0866Nbg1EJ';

export const sendMailReceipt = async (data: any) => {
  const templateParams = { ...data };
  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_ID);
    return res;
  } catch (error) {
    return error;
  }
};
