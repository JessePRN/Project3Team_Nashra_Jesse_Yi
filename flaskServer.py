import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from datetime import datetime
from flask import Flask, jsonify, render_template

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

@app.route("/api")
def welcome():
    """List all available api routes."""
    return (
        f'<b>Available Routes:</b><br/>'
        f'# retrieves unique list of stock ticker names<br/>'
        f'@app.route("/tickers/names/unique")<br/>'
        f'# retrieves all tickers<br/>'
        f'@app.route("/tickers/all")<br/>'
        f'# retrieves all tickers by start date<br/>'
        f'@app.route("/tickers/<start>")<br/>'
        f'# retrieves unique list of sectors excluding crypto<br/>'
        f'@app.route("/tickers/sector/unique")<br/>'
        f'# retrieves ticker data by name<br/>'
        f'@app.route("/tickers/name/<name>")<br/>'
        f'# retrieves ticker data by sector<br/>'
        f'@app.route("/tickers/sector/<sector>")<br/>'
        f'# retrieves unique list of crypto names<br/>'
        f'@app.route("/crypto/names/unique")<br/>'
        # f"/api/v1.0/&lt;start&gt;/&lt;end&gt;<br/>"
    )


@app.route("/")
def template():
    """List all available api routes."""
    return render_template("index.html")

# retrieves unique list of stock ticker names
@app.route("/tickers/names/unique")
def namesUnique():
    session = Session(engine)
    names = session.query(tickers.Name).filter(tickers.Sector != "Crypto Currency").all()
    namesSet = set(names)
    names = list(namesSet)
    namesPrint = list(np.ravel(names))
    session.close()
    return jsonify(namesPrint)

# retrieves all tickers (entire db)
@app.route("/tickers/all")
def tickersAll():
    session = Session(engine)
    tickersAll = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close, tickers.Sector).all()
    # uniqueTickers = set(tempSince)
    # tempSince = list(uniqueTickers)
    all_names = list(np.ravel(tickersAll))
    session.close()
    return jsonify(all_names)

# retrieves all tickers by start date
@app.route("/tickers/<start>")
def tickersStart(start):
    session = Session(engine) 
    tickersSince = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close, tickers.Sector).filter(tickers.Date > start).all()
    tickersSincePrint = list(np.ravel(tickersSince))
    session.close()
    return jsonify(tickersSincePrint)

# retrieves unique list of sectors excluding crypto
@app.route("/tickers/sector/unique")
def allSectors():
    session = Session(engine)
    names = session.query(tickers.Sector).filter(tickers.Sector != "Crypto Currency").all()
    namesSet = set(names)
    names = list(namesSet)
    namesPrint = list(np.ravel(names))
    session.close()
    return jsonify(namesPrint)     

# retrieves ticker data by name
@app.route("/tickers/name/<name>")
def tickersName(name):
    session = Session(engine)
    tickersAll = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close, tickers.Sector).filter(tickers.Name == name).all()
    # print(tickersAll)
    # this line converts sqlite query to dictionary
    tickerDict = [dict(ticker) for ticker in tickersAll]
    session.close()
    return jsonify(tickerDict)

# retrieves ticker data by sector
@app.route("/tickers/sector/<sector>")
def tickersSector(sector):
    session = Session(engine)
    tickersAll = session.query(tickers.Name, tickers.Date, tickers.Ticker, tickers.Close, tickers.Sector).filter(tickers.Sector == sector).all()
    # print(tickersAll)
    tickerDict = [dict(ticker) for ticker in tickersAll]
    session.close()
    return jsonify(tickerDict)    

# retrieves unique list of crypto names
@app.route("/crypto/names/unique")
def cryptoUnique():
    session = Session(engine)
    names = session.query(tickers.Name).filter(tickers.Sector == "Crypto Currency").all()
    namesSet = set(names)
    names = list(namesSet)
    namesPrint = list(np.ravel(names))
    session.close()
    return jsonify(namesPrint)    

if __name__ == '__main__':
    app.run(debug=True)
