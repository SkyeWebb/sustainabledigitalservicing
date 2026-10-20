function getHealth(req, res) {
    res.send( 
        "🤖 Health Route with GET method - this endpoint confirms the services is running"
       );
  }
  
  export default {
    getHealth,
  };