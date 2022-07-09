import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from datetime import datetime
from flask import Flask, jsonify, render_template
from datetime import date

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///stocks.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
tickers = Base.classes.stocks

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<b>Use Template Below</b><br/>"
        f"/template<br/><br/>"
        f"<b>Available Routes:</b><br/>"
        f"<br/>Names:<br/>"
        f"/names/all<br/>"
        f"/names/&lt;start&gt;<br/>"
        f"/names/unique<br/>"
        f"<br/><b>Tickers</b>:<br/>"
        f"/tickers/all<br/>"
        f"/tickers/&lt;start&gt;<br/>"
        # f"/api/v1.0/&lt;start&gt;/&lt;end&gt;<br/>"
    )
@app.route("/template")
def template():
    """List all available api routes."""
    return render_template("index.html")

@app.route("/names/all")
def namesAll():
    session = Session(engine)
    results = session.query(tickers.Name).all()
    session.close()
    all_names = list(np.ravel(results))
    return jsonify(all_names)

@app.route("/names/<start>")
def namesStart(start):
    session = Session(engine) 
    tempSince = session.query(tickers.Name).filter(tickers.Date >= start).all()
    all_names = list(np.ravel(tempSince))
    session.close()
    return jsonify(all_names)


@app.route("/names/unique")
def namesUnique():
    session = Session(engine)
    names = session.query(tickers.Name).all()
    namesSet = set(names)
    names = list(namesSet)
    namesPrint = list(np.ravel(names))
    session.close()
    return jsonify(namesPrint)

@app.route("/tickers/all")
def tickersAll():
    session = Session(engine)
    tickersAll = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close).all()
    # uniqueTickers = set(tempSince)
    # tempSince = list(uniqueTickers)
    all_names = list(np.ravel(tickersAll))
    session.close()
    return jsonify(all_names)

@app.route("/tickers/<start>")
def tickersStart(start):
    session = Session(engine) 
    tickersSince = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close).filter(tickers.Date > start).all()
    tickersSincePrint = list(np.ravel(tickersSince))
    # typeVar = type(tickersSince)
    
    # print("type of Date is " + typeVar)
    session.close()
    return jsonify(tickersSincePrint)

if __name__ == '__main__':
    app.run(debug=True)
