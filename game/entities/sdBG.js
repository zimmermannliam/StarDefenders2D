
import sdWorld from '../sdWorld.js';
import sdEntity from './sdEntity.js';
import sdBlock from './sdBlock.js';

import sdRenderer from '../client/sdRenderer.js';


class sdBG extends sdEntity
{
	static init_class()
	{
		sdBG.img_bg22 = sdWorld.CreateImageFromFile( 'bg' );
		
		sdBG.MATERIAL_PLATFORMS = 0;
		sdBG.MATERIAL_GROUND = 1;
		
		let that = this; setTimeout( ()=>{ sdWorld.entity_classes[ that.name ] = that; }, 1 ); // Register for object spawn
	}
	get hitbox_x1() { return 0; }
	get hitbox_x2() { return this.width; }
	get hitbox_y1() { return 0; }
	get hitbox_y2() { return this.height; }
	
	get hard_collision()
	{ return true; }
	
	IsBGEntity() // True for BG entities, should handle collisions separately
	{ return true; }
	
	/*GetIgnoredEntityClasses() // Null or array, will be used during motion if one is done by CanMoveWithoutOverlap or ApplyVelocityAndCollisions
	{
		return [ 'sdBlock', 'sdDoor', 'sdWater', 'sdGun', 'sdCrystal', 'sdCharacter', 'sdTeleport', 'sdCom' ];
	}*/
	
	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return true; }
	
	Damage( dmg, initiator=null )
	{
		if ( !sdWorld.is_server )
		return;
		
		this.remove();
	}
	constructor( params )
	{
		super( params );
		
		this.width = params.width || 32;
		this.height = params.height || 32;
		
		this.material = params.material || sdBG.MATERIAL_PLATFORMS;
		
		this.filter = params.filter || '';
		
		this.SetHiberState( sdEntity.HIBERSTATE_HIBERNATED_NO_COLLISION_WAKEUP );
	}
	MeasureMatterCost()
	{
		return this.width / 16 * this.height / 16;
	}
	//RequireSpawnAlign() 
	//{ return true; }
	
	get spawn_align_x(){ return Math.min( this.width, 16 ); };
	get spawn_align_y(){ return Math.min( this.height, 16 ); };
	
	//Draw( ctx, attached )
	DrawBG( ctx, attached )
	{
		var w = this.width;
		var h = this.height;
		
		ctx.filter = this.filter;//'hue-rotate(90deg)';
		
		if ( this.material === sdBG.MATERIAL_PLATFORMS )
		ctx.drawImageFilterCache( sdBG.img_bg22, 0, 0, w,h, 0,0, w,h );
		else
		if ( this.material === sdBG.MATERIAL_GROUND )
		ctx.drawImageFilterCache( sdBlock.img_ground11, 0, 0, w,h, 0,0, w,h );

		ctx.filter = 'none';
	}
}
//sdBG.init_class();

export default sdBG;