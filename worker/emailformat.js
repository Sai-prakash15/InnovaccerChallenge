let checkoutFormat = (content) =>
    `You visited ${content.host.address} at ${new Date(content.visitor.checkinTime)}`
    + `and stayed till ${new Date(content.visitor.checkoutTime)}.` + '\n'
    + 'Your host details: \n'
    + `Name: ${content.host.name}` + '\n' 
    + `Email: ${content.host.email}` + '\n'
    + `Phone: ${content.host.phone}` + '\n'; 

let checkinFormat = (content) => 
    `Details of booking at your venue:` + '\n'
        + `Name: ${content.visitor.name}` + '\n'
        + `Phone: ${content.visitor.phone}` + '\n'
        + `Email: ${content.visitor.email}` + '\n'
        + `Check-in Time: ${new Date(content.visitor.checkinTime)}` + '\n'
        + `Check-out Time: ${new Date(content.visitor.checkoutTime)}` + '\n'
        + `Venue: ${content.host.address}`;

module.exports = {
    checkinFormat: checkinFormat,
    checkoutFormat: checkoutFormat
};