// Path: frontend/src/utils/dateUtils.js
import moment from "moment";

export const formatDate = (date) => moment(date).format("DD MMM YYYY");
export const fromNow = (date) => moment(date).fromNow();
