def custom_preprocessing_hook(endpoints):
    # your modifications to the list of operations that are exposed in the schema
    # for path, path_regex, method, callback in endpoints:
    #     pass
    return endpoints


def custom_postprocessing_hook(result, generator, request, public):
    result["servers"] = [
        {"url": request.build_absolute_uri("/"), "description": "API URL"},
    ]
    return result
