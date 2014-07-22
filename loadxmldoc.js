function loadXMLDoc(dname) {
    try //Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", dname, false);
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            xmlhttp.send("");
            xmlDoc = xmlhttp.responseXML;
        } catch (e) {
            alert(e.message)
        }
    }
    try {
        return (xmlDoc);
    } catch (e) {
        alert(e.message)
    }
    return (null);
}