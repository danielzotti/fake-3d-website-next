import {useCallback, useEffect, useState} from "react";

export const usePermissions = (permissionName: PermissionName) => {
    const [permissionState, setPermissionState] = useState<PermissionState>()

    const handlePermission = useCallback(() => {
        navigator.permissions.query({name: permissionName}).then((result) => {
            setPermissionState(result.state);
            result.addEventListener("change", () => {
                setPermissionState(result.state);
            });
        });
    }, [permissionName]);

    useEffect(() => {
        handlePermission();
    }, [handlePermission]);

    return {
        handlePermission,
        permissionState,
    }
}
