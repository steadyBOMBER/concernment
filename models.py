from database import get_db

def create_shipment(tracking, title, origin, destination):
    """
    Insert a new shipment into the shipments table.
    origin and destination should be (lat, lng) tuples.
    """
    db = get_db()
    db.execute(
        "INSERT INTO shipments (tracking, title, origin_lat, origin_lng, dest_lat, dest_lng) VALUES (?, ?, ?, ?, ?, ?)",
        (tracking, title, origin[0], origin[1], destination[0], destination[1])
    )
    db.commit()

def add_checkpoint(tracking, lat, lng, label, note=""):
    """
    Add a checkpoint to a shipment (found by tracking number).
    Returns True if successful, False if shipment not found.
    """
    db = get_db()
    shipment = db.execute("SELECT id FROM shipments WHERE tracking=?", (tracking,)).fetchone()
    if not shipment:
        return False
    db.execute(
        "INSERT INTO checkpoints (shipment_id, lat, lng, label, note) VALUES (?, ?, ?, ?, ?)",
        (shipment["id"], lat, lng, label, note)
    )
    db.commit()
    return True
