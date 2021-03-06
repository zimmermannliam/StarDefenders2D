
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdGun from './sdGun.js';

class sdMatterContainer extends sdEntity
{
	static init_class()
	{
		sdMatterContainer.img_matter_container = sdWorld.CreateImageFromFile( 'matter_container' );
		sdMatterContainer.img_matter_container_empty = sdWorld.CreateImageFromFile( 'matter_container_empty' );
		
		let that = this; setTimeout( ()=>{ sdWorld.entity_classes[ that.name ] = that; }, 1 ); // Register for object spawn
	}
	get hitbox_x1() { return -10; }
	get hitbox_x2() { return 10; }
	get hitbox_y1() { return -14; }
	get hitbox_y2() { return 14; }
	
	get spawn_align_x(){ return 8; };
	get spawn_align_y(){ return 8; };
	
	get hard_collision() // For world geometry where players can walk
	{ return true; }
	
	RequireSpawnAlign()
	{ return true; }
	
	constructor( params )
	{
		super( params );
		
		this.matter_max = params.matter_max || 640;
		
		this.matter = this.matter_max;
		
		this._hmax = 320;
		this._hea = this._hmax;
		
		this._regen_timeout = 0;
	}
	Damage( dmg, initiator=null )
	{
		dmg = Math.abs( dmg );
		
		this._hea -= dmg;
		
		if ( this._hea <= 0 )
		this.remove();
	
		this._regen_timeout = 60;

	}
	
	onThink( GSPEED ) // Class-specific, if needed
	{
		this.matter = Math.min( this.matter_max, this.matter + GSPEED * 0.001 * this.matter_max / 80 );
		
		if ( this._regen_timeout > 0 )
		this._regen_timeout -= GSPEED;
		else
		{
			if ( this._hea < this._hmax )
			{
				this._hea = Math.min( this._hea + GSPEED, this._hmax );
			}
		}
		
		var x = this.x;
		var y = this.y;
		for ( var xx = -2; xx <= 2; xx++ )
		for ( var yy = -2; yy <= 2; yy++ )
		{
			var arr = sdWorld.RequireHashPosition( x + xx * 32, y + yy * 32 );
			for ( var i = 0; i < arr.length; i++ )
			if ( arr[ i ] !== this )
			if ( typeof arr[ i ].matter !== 'undefined' )
			{
				if ( sdWorld.inDist2D( arr[ i ].x, arr[ i ].y, x, y, 30 ) >= 0 )
				{
					this.TransferMatter( arr[ i ], 0.01, GSPEED );
				}
			}
		}

	}
	DrawHUD( ctx, attached ) // foreground layer
	{
		sdEntity.Tooltip( ctx, "Matter container ( " + ~~(this.matter) + " / " + ~~(this.matter_max) + " )" );
	}
	Draw( ctx, attached )
	{
		ctx.drawImageFilterCache( sdMatterContainer.img_matter_container_empty, - 16, - 16, 32,32 );
		
		if ( this.matter_max > 40 )
		ctx.filter = 'hue-rotate('+( this.matter_max - 40 )+'deg)';
	
		ctx.globalAlpha = this.matter / this.matter_max;
		
		ctx.drawImageFilterCache( sdMatterContainer.img_matter_container, - 16, - 16, 32,32 );
		
		ctx.globalAlpha = 1;
		ctx.filter = 'none';
	}
	onRemove() // Class-specific, if needed
	{
		sdSound.PlaySound({ name:'crystal', x:this.x, y:this.y, volume:1 });
				
		sdWorld.DropShards( this.x, this.y, 0, 0, 
			Math.ceil( Math.max( 5, this.matter / this.matter_max * 40 / sdWorld.crystal_shard_value * 0.5 ) ),
			this.matter_max / 40
		);
		/*if ( sdWorld.is_server )
		{
			for ( var i = 0; i < 5; i++ )
			{
				let ent = new sdGun({ class:sdGun.CLASS_CRYSTAL_SHARD, x: this.x, y:this.y });
				ent.sx = this.sx + Math.random() * 8 - 4;
				ent.sy = this.sy + Math.random() * 8 - 4;
				ent.ttl = 30 * 7 * ( 0.7 + Math.random() * 0.3 );
				sdEntity.entities.push( ent );
			}
		}*/
	}
	
	MeasureMatterCost()
	{
	//	return 0; // Hack
		
		return this._hmax * sdWorld.damage_to_matter + this.matter;
	}
}
//sdMatterContainer.init_class();

export default sdMatterContainer;