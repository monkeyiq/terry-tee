var b = require('bonescript');

function TerryTee( leftPWMpin, rightPWMpin, leftReduction, rightReduction )
{
    TerryTee.running = 1;
    TerryTee.leftPWMpin = leftPWMpin;
    TerryTee.rightPWMpin = rightPWMpin;
    TerryTee.leftReduction = leftReduction;
    TerryTee.rightReduction = rightReduction;
    TerryTee.speed = 0;
    TerryTee.heading = 50;
    console.log("TerryTee()");
}

TerryTee.prototype.setSpeed = function ( v ) 
{
    if( !TerryTee.running )
	return;
    if( v < 40 )
    {
	TerryTee.speed = 0;
	this.setPWM( TerryTee.leftPWMpin,  0 );
	this.setPWM( TerryTee.rightPWMpin, 0 );
	return;
    }

    var leftv  = v;
    var rightv = v;
    var heading = TerryTee.heading;
    
    if( heading > 50 )
    {
	if( heading >= 95 )
	    leftv = 0;
	else
	    leftv *= 1 - (heading-50)/50;
    }
    if( heading < 50 )
    {
	if( heading <= 5 )
	    rightv = 0;
	else
	    rightv *= 1 - (50-heading)/50;
    }
    console.log("setSpeed v:" + v + " leftv:" + leftv + " rightv:" + rightv );
    this.setPWM( TerryTee.leftPWMpin,  leftv );
    this.setPWM( TerryTee.rightPWMpin, rightv );
    TerryTee.speed = v;
};

TerryTee.prototype.setHeading = function( v ) 
{
    if( !TerryTee.running )
	return;

    TerryTee.heading = v;
    this.setSpeed( TerryTee.speed );
};


TerryTee.prototype.setPWM = function (PWMpin,perc) 
{
    if( !TerryTee.running )
	return;

    if( PWMpin == TerryTee.leftPWMpin ) {
	perc *= TerryTee.leftReduction;
    } else {
	perc *= TerryTee.rightReduction;
    }

    if( perc >  1 )   
	perc /= 100;

    console.log("awrite PWMpin:" + PWMpin + " perc:" + perc  );
    b.analogWrite( PWMpin, perc, 2000 );
};

TerryTee.prototype.forceStop = function () 
{
    this.setHeading( 0 );
    this.setSpeed( 0 );
    TerryTee.running = 0;
    setTimeout(function() {
	TerryTee.running = 1;
	console.log('Terry is back in the mix!');
    }, 30000);
}


TerryTee.errorHandler = function (error) 
{
    console.log('Error: ' + error.message);
};

module.exports = TerryTee;
