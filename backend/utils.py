from bson import ObjectId


def normalize_id(value):
    if isinstance(value, ObjectId):
        return str(value)
    return value


def to_json(document):
    if document is None:
        return None

    if isinstance(document, list):
        return [to_json(item) for item in document]

    if isinstance(document, dict):
        result = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, dict) or isinstance(value, list):
                result[key] = to_json(value)
            else:
                result[key] = value
        if "_id" in result:
            result["id"] = result.pop("_id")
        return result

    return document


def prepare_object_id(value):
    if ObjectId.is_valid(value):
        return ObjectId(value)
    raise ValueError(f"Invalid ObjectId: {value}")
